import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface Props {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
}

export const BulgeOut = (({children, width = 'fit-content'}: Props) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const mainControls = useAnimation()
    useEffect(() => {
        if(isInView) {
            mainControls.start("visible")
        }
    }, [isInView])

    return (
        <div 
            className="text-white"
            ref = {ref}
            style={{ position: "relative", width, overflow: "hidden" }}
        >
            <motion.div
                variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1 },
                }}
                animate = {mainControls}
                initial = 'hidden'
                transition = {{ duration: 1.5, delay: 0.5 }}

            >
                {children}
            </motion.div>
        </div>
    )
})
